defmodule Nori.Component do
  defstruct module: nil, attributes: %{}, children: [], key: nil
  @callback render(props :: map, state :: map) :: any()

  defmacro __using__(__opts) do
    quote do
      @behaviour Nori.Component
      import Nori

      def component(), do: component([], do: [])

      def component(do: block), do: component([], do: block)
      def component(props), do: component(props, do: [])

      def component(attributes, do: block) do
        %Nori.Component{
          module: __MODULE__,
          attributes: Enum.into(attributes, %{}),
          children: block
        }
      end
    end
  end
end
