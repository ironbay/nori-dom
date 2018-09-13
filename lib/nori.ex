defmodule Nori do
  defstruct name: "", attributes: [], children: []

  def element(name, children), do: element(name, [], children)

  def element(name, attributes, children) when is_list(children) === false,
    do: element(name, attributes, [children])

  def element(name, attributes, children) do
    %Nori{
      name: name,
      attributes: attributes,
      children: children
    }
  end

  def diff(old, next), do: diff(old, next, [])

  def diff(old = %{}, next = %{}, path) do
    case equals(old, next) do
      true ->
        old.children
        |> zip(next.children)
        |> Stream.with_index()
        |> Enum.flat_map(fn {{left, right}, index} -> diff(left, right, [index | path]) end)

      false ->
        [
          diff(old, nil, path),
          diff(nil, next, path)
        ]
    end
  end

  def diff(nil, next = %{}, path) do
    [{:create, {path, next}}]
  end

  def diff(%{}, nil, path) do
    [{:delete, path}]
  end

  def diff(old, next, path) when old != next, do: [{:inner, {path, next}}]
  def diff(old, next, _path) when old == next, do: []

  def zip([lh | lt], [rh | rt]) do
    [{lh, rh} | zip(lt, rt)]
  end

  def zip([], []), do: []
  def zip([lh | lt], []), do: zip([lh | lt], [nil])
  def zip([], [rh | rt]), do: zip([nil], [rh | rt])

  def equals(%{name: o_name}, %{name: n_name}), do: o_name === n_name

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
      element("div", [
        element("div", [class: "blue"], "hello")
      ]),
      element("span", "lol")
    ])
  end

  def test2() do
    element("div", [
      element("div", [
        element("div", [class: "blue"], "goodbye")
      ]),
      element("span", "a"),
      element("span", "b"),
      element("span", "c")
    ])
  end
end
