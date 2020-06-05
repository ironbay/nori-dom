defmodule Nori.Component do
  defstruct module: nil, props: %{}, children: []
  @callback render(props :: map, state :: map) :: any()

  defmacro component(mod), do: component_build(mod, [], do: [])

  defmacro component(mod, do: block), do: component_build(mod, [], do: block)
  defmacro component(mod, props), do: component_build(mod, props, do: [])
  defmacro component(mod, props, do: block), do: component_build(mod, props, do: block)

  defp component_build(mod, props, do: block) do
    children = Nori.Macro.parse_children(block) |> IO.inspect()

    quote do
      %Nori.Component{
        module: unquote(mod),
        props: Enum.into(unquote(props), %{}),
        children: unquote(children)
      }
    end
  end

  @spec __using__(any) :: {:__block__, [], [{:@, [...], [...]} | {:import, [...], [...]}, ...]}
  defmacro __using__(__opts) do
    quote do
      @behaviour Nori.Component
      import Nori
    end
  end
end
