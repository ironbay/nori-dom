defmodule Nori.Node do
  defstruct name: nil, children: [], key: [], props: %{}

  def render(input), do: render(input, %{states: %{}, callbacks: %{}})

  def render(input, ctx), do: render(input, ctx, [0])

  def render(input = %Nori.Element{}, ctx, path) do
    [_ | parent] = path
    {props, ctx} = process_callbacks(input.props, parent, ctx)

    {children, ctx} =
      input.children
      |> Stream.flat_map(fn
        result when is_list(result) -> result
        result -> [result]
      end)
      |> Stream.with_index()
      |> Enum.reduce({[], ctx}, fn
        {item, index}, {children, ctx} when is_map(item) ->
          {child, ctx} = render(item, ctx, [item.props[:key] || index | path])
          {children ++ [child], ctx}

        {item, index}, {children, ctx} ->
          {children ++
             [
               %Nori.Node{
                 name: :text,
                 key: [index | path],
                 children: to_string(item)
               }
             ], ctx}
      end)

    {%Nori.Node{
       name: input.name,
       props: props,
       key: path,
       children: children
     }, ctx}
  end

  def render(input = %Nori.Component{}, ctx, path) do
    {ctx, state} =
      case Kernel.get_in(ctx, [:states, path]) do
        nil ->
          initial = input.module.mount()
          {Kernel.put_in(ctx, [:states, path], initial), initial}

        result ->
          {ctx, result}
      end

    [_ | parent] = path
    {props, ctx} = process_callbacks(input.props, parent, ctx)
    props = Map.put(props, :children, input.children)
    output = input.module.render(props, state)
    render(output, ctx, path)
  end

  def process_callbacks(props, parent, ctx) do
    props
    |> Enum.reduce({props, ctx}, fn
      {key, value}, {props, ctx} when is_function(value) ->
        ref = value |> :erlang.phash2()

        {
          Map.put(props, key, ref),
          Kernel.put_in(ctx, [:callbacks, ref], {parent, value})
        }

      _, collect ->
        collect
    end)
  end

  def diff(old, next) do
    old
    |> compare_element(next)
    |> List.flatten()
    |> case do
      [] ->
        props = compare_props(old, next)
        children = compare_children(old, next)
        props ++ children

      ops ->
        ops
    end
  end

  def compare_element(nil, next = %{name: :text}) do
    [{:text_create, next.key, next}]
  end

  def compare_element(old = %{name: :text}, nil) do
    [{:text_delete, old.key}]
  end

  def compare_element(
        old = %{name: :text, children: o_children},
        next = %{name: :text, children: n_children}
      )
      when o_children != n_children do
    [{:text_change, old.key, next.children}]
  end

  def compare_element(nil, next = %{}) do
    [{:element_create, next.key, next}]
  end

  def compare_element(old = %{}, nil) do
    [{:element_delete, old.key, []}]
  end

  def compare_element(old = %{name: o_name}, next = %{name: n_name})
      when o_name != n_name do
    [
      diff(nil, next),
      diff(old, nil)
    ]
  end

  def compare_element(_, _), do: []

  def compare_props(old, next) do
    {ops, remaining} =
      Enum.reduce(old.props, {[], next.props}, fn {key, value}, {ops, next} ->
        case Map.pop(next, key) do
          {^value, remaining} ->
            {ops, remaining}

          {nil, remaining} ->
            {[{:prop_delete, old.key, key} | ops], remaining}

          {changed, remaining} ->
            {[{:prop_change, old.key, {key, changed}} | ops], remaining}
        end
      end)

    Enum.reduce(remaining, ops, fn {key, value}, ops ->
      [{:prop_create, next.key, {key, value}} | ops]
    end)
  end

  def compare_children(old, next) do
    old.children
    |> zip(next.children)
    |> Enum.flat_map(fn {left, right} ->
      diff(left, right)
    end)
  end

  def zip([lh | lt], [rh | rt]) do
    [{lh, rh} | zip(lt, rt)]
  end

  def zip([], []), do: []
  def zip([lh | lt], []), do: zip([lh | lt], [nil])
  def zip([], [rh | rt]), do: zip([nil], [rh | rt])

  def zip(_, _), do: []

  def to_html(%Nori.Node{name: :text, children: value}) do
    value
  end

  def to_html(item) do
    [
      "<",
      Atom.to_string(item.name),
      " nori=\"",
      Enum.join(item.key, "."),
      "\"",
      Enum.map(item.props, fn {key, value} ->
        [" ", Atom.to_string(key), "=\"", to_string(value), "\" "]
      end),
      ">",
      Enum.map(item.children, &to_html/1),
      "</",
      Atom.to_string(item.name),
      ">"
    ]
  end
end
