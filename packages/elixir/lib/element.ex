defmodule Nori.Element do
  defstruct name: nil, props: %{}, children: []

  defmacro defelement(name) do
    quote do
      defmacro unquote(name)(), do: Nori.Element.element(unquote(name))

      defmacro unquote(name)(props_or_children),
        do: Nori.Element.element(unquote(name), props_or_children)

      defmacro unquote(name)(props, children),
        do: Nori.Element.element(unquote(name), props, children)
    end
  end

  def element(name), do: element(name, [], do: [])
  def element(name, do: children), do: element(name, [], do: children)
  def element(name, props), do: element(name, props, do: [])

  @spec element(any, any, [{:do, any}, ...]) ::
          {:%, [], [{:%{}, [], [...]} | {:__aliases__, [...], [...]}, ...]}
  def element(name, props, do: block) do
    children = Nori.Macro.parse_children(block)

    quote do
      %Nori.Element{
        name: unquote(name),
        props: Enum.into(unquote(props), %{}),
        children: unquote(children)
      }
    end
  end
end
