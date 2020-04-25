defmodule Nori.Element do
  defstruct name: "", attributes: [], children: []

  def key(element), do: Keyword.get(element.attributes, :key, 0)

  defmacro defelement(name) do
    quote do
      defmacro unquote(name)(), do: Nori.Element.element(unquote(name))
      defmacro unquote(name)(one), do: Nori.Element.element(unquote(name), one)
      defmacro unquote(name)(one, two), do: Nori.Element.element(unquote(name), one, two)
    end
  end

  def element(name), do: element(name, [], do: [])
  def element(name, do: children), do: element(name, [], do: children)
  def element(name, attr), do: element(name, attr, do: [])

  def element(name, attr, do: children) do
    elems = parse_children(children)

    quote do
      children =
        unquote(elems)
        |> Stream.flat_map(fn
          child when is_list(child) -> child
          result -> [result]
        end)
        |> Stream.filter(fn item -> item end)
        |> Enum.to_list()

      %Nori.Element{
        name: unquote(name),
        attributes: unquote(attr),
        children: Nori.Element.generate_keys(children)
      }
    end
  end

  def parse_children(input) do
    case input do
      {:__block__, _, elems} -> elems
      [] -> []
      result -> [result]
    end
  end

  def generate_keys(children) do
    children
    |> Stream.with_index()
    |> Enum.map(fn
      {result = %Nori.Element{}, index} ->
        %{result | attributes: Keyword.put(result.attributes, :key, index)}

      {child, _} ->
        child
    end)
  end
end
