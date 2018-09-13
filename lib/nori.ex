defmodule Nori do
  defstruct name: "", attributes: [], children: []

  def element(name, children), do: element(name, [], children)

  def element(name, attributes, children) when is_list(children) === false,
    do: element(name, attributes, [children])

  def element(name, attributes, children) do
    %Nori{
      name: name,
      attributes: Enum.into(attributes, %{}),
      children: children
    }
  end

  def diff(old, next), do: diff(old, next, [])

  def diff(old = %{}, next = %{}, path) do
    elements = compare_element(old, next, path)

    attributes =
      old.attributes
      |> Enum.to_list()
      |> zip(Enum.to_list(next.attributes))
      |> Enum.flat_map(fn {left, right} -> compare_attributes(left, right, path) end)

    children =
      old.children
      |> zip(next.children)
      |> Stream.with_index()
      |> Enum.flat_map(fn {{left, right}, index} -> diff(left, right, [index | path]) end)

    elements ++ attributes ++ children
  end

  def diff(old, next, path) do
    compare_element(old, next, path)
  end

  def compare_element(nil, next = %{}, path) do
    [{:create, {path, next}}]
  end

  def compare_element(%{}, nil, path) do
    [{:delete, path}]
  end

  def compare_element(old = %{name: o_name}, next = %{name: n_name}, path)
      when o_name != n_name do
    [
      diff(nil, next, path),
      diff(old, nil, path)
    ]
  end

  def compare_element(%{}, %{}, _), do: []

  def compare_element(_old, nil, path), do: [{:delete_text, path}]
  def compare_element(old, next, path) when old != next, do: [{:set_text, {path, next}}]
  def compare_element(old, next, _path) when old == next, do: []

  def compare_attributes({key, _}, nil, path), do: [{:delete_attribute, {path, key}}]
  # def diff_attributes(nil, {key, value}, path), do: [{:create_attribute, {path, key, value}}]

  def compare_attributes(old, next = {key, value}, path) when old != next,
    do: [{:set_attribute, {path, key, value}}]

  def compare_attributes(_old, _next, _path), do: []

  def zip([lh | lt], [rh | rt]) do
    [{lh, rh} | zip(lt, rt)]
  end

  def zip([], []), do: []
  def zip([lh | lt], []), do: zip([lh | lt], [nil])
  def zip([], [rh | rt]), do: zip([nil], [rh | rt])

  def to_html(%{name: name, attributes: attributes, children: children}) do
    [
      "<",
      name,
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
    element("div", [
      element("div", [class: "pink"], [
        element("div", [class: "blue"], "hello")
      ]),
      element("span", "lol")
    ])
  end

  def test2() do
    element("div", [
      element("div", [
        element("div", [class: "green"], [])
      ]),
      element("span", "a"),
      element("span", "b"),
      element("span", "c")
    ])
  end
end
