defmodule Nori do
  alias Nori.Callback
  defstruct key: 0, name: "", attributes: [], children: []

  def element(name), do: element(name, [], [])
  def element(name, attributes), do: element(name, attributes, [])

  def element(name, attributes, children) when is_list(children) === false,
    do: element(name, attributes, [children])

  def element(name, attributes, children) do
    %Nori{
      name: name,
      attributes:
        attributes
        |> Enum.map(fn
          {key, value} when is_function(value) -> {key, Callback.add(value)}
          {key, {value, args}} when is_function(value) -> {key, Callback.add(value, args)}
          {key, value} when is_binary(value) -> {key, value}
          {key, value} -> {key, inspect(value)}
        end),
      children:
        children
        |> Stream.flat_map(fn
          item when is_list(item) -> item
          item -> [item]
        end)
        |> Stream.filter(fn item -> item != false && item != nil end)
        |> Stream.with_index()
        |> Enum.map(fn
          {item = %Nori{}, index} -> Map.put(item, :key, index)
          {item, _} when is_binary(item) -> item
          {item, _} -> inspect(item)
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
          |> zip(Enum.to_list(next.attributes))
          |> Enum.flat_map(fn {left, right} ->
            compare_attributes(left, right, [next.key | path])
          end)

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

  def compare_element(_old, nil, path), do: [{:text_delete, path, nil}]
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
end
