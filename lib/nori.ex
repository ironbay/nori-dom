defmodule Nori do
  defstruct key: 0, name: "", attributes: [], children: []

  def element(name, children), do: element(name, [], children)

  def element(name, attributes, children) when is_list(children) === false,
    do: element(name, attributes, [children])

  def element(name, attributes, children) do
    %Nori{
      name: name,
      attributes: Enum.into(attributes, %{}),
      children:
        children
        |> Enum.with_index()
        |> Enum.map(fn
          {item = %Nori{}, index} -> Map.put(item, :key, index)
          {item, _} -> item
        end)
    }
  end

  def diff(old, next),
    do:
      diff(old, next, [])
      |> Stream.map(fn {op, path, data} -> {op, Enum.reverse(path), data} end)
      |> Enum.sort_by(fn {op, _, _} ->
        case op do
          :element_delete -> 0
          :attribute_delete -> 1
          _ -> 10
        end
      end)

  def diff(old = %{}, next = %{}, path) do
    case Enum.flat_map(compare_element(old, next, path), & &1) do
      [] ->
        attributes =
          old.attributes
          |> Enum.to_list()
          |> zip(Enum.to_list(next.attributes))
          |> Enum.flat_map(fn {left, right} -> compare_attributes(left, right, path) end)

        children =
          old.children
          |> zip(next.children)
          |> Enum.flat_map(fn {left, right} -> diff(left, right, [next.key | path]) end)

        attributes ++ children

      elements ->
        elements
    end
  end

  def diff(old, next, path) do
    compare_element(old, next, path)
  end

  def compare_element(nil, next = %{}, path) do
    [{:element_create, [next.key | path], next}]
  end

  def compare_element(old = %{}, nil, path) do
    [{:element_delete, [old.key | path], nil}]
  end

  def compare_element(old = %{name: o_name}, next = %{name: n_name}, path)
      when o_name != n_name do
    [
      diff(nil, next, path),
      diff(old, nil, path)
    ]
  end

  def compare_element(%{}, %{}, _), do: []

  def compare_element(_old, nil, path), do: [{:text_delete, path}]
  def compare_element(old, next, path) when old != next, do: [{:text_set, path, next}]
  def compare_element(old, next, _path) when old == next, do: []

  def compare_attributes({key, _}, nil, path), do: [{:attribute_delete, path, key}]
  # def diff_attributes(nil, {key, value}, path), do: [{:create_attribute, {path, key, value}}]

  def compare_attributes(old, next = {key, value}, path) when old != next,
    do: [{:attribute_set, path, {key, value}}]

  def compare_attributes(_old, _next, _path), do: []

  def zip([lh | lt], [rh | rt]) do
    [{lh, rh} | zip(lt, rt)]
  end

  def zip([], []), do: []
  def zip([lh | lt], []), do: zip([lh | lt], [nil])
  def zip([], [rh | rt]), do: zip([nil], [rh | rt])

  def to_html(%{name: name, key: key, attributes: attributes, children: children}) do
    [
      "<",
      name,
      " nori=\"",
      Integer.to_string(key),
      "\"",
      Enum.map(attributes, fn {key, value} -> [" ", Atom.to_string(key), "=\"", value, "\" "] end),
      ">",
      Enum.map(children, &to_html/1),
      "</",
      name,
      ">"
    ]
  end

  def to_html(content) do
    content
  end

  def test() do
    diff(test1(), test2())
  end

  def test1() do
    element("div", [class: "pad-8 line-5"], [
      element("div", "Hey there"),
      element("div", "Bye there")
    ])
  end

  def test2() do
    element("div", [class: "pad-8 line-5"], [
      element("div", "Hey there"),
      element("div", "Bye there"),
      element("div", "Bye there")
    ])
  end
end
