defmodule Nori.Element do
  defstruct name: nil, attributes: %{}, children: []

  defmacro defelement(name) do
    quote do
      defmacro unquote(name)(), do: Nori.Element.element(unquote(name))

      defmacro unquote(name)(attr_or_children),
        do: Nori.Element.element(unquote(name), attr_or_children)

      defmacro unquote(name)(attr, children),
        do: Nori.Element.element(unquote(name), attr, children)
    end
  end

  # defmacro element(type, attr, do: block) do
  #   children = Nori.Macro.parse_children(block)

  #   quote do
  #     %Nori.Element{
  #       type: unquote(type),
  #       attributes: Enum.into(unquote(attr), %{}),
  #       children: unquote(children)
  #     }
  #   end
  # end

  def element(name), do: element(name, [], do: [])
  def element(name, do: children), do: element(name, [], do: children)
  def element(name, attr), do: element(name, attr, do: [])

  def element(name, attr, do: block) do
    children = Nori.Macro.parse_children(block)

    quote do
      %Nori.Element{
        name: unquote(name),
        attributes: Enum.into(unquote(attr), %{}),
        children: unquote(children)
      }
    end
  end
end

defmodule Nori.ExampleComponent do
  use Nori.Component

  def mount(), do: %{count: :random.uniform(1000)}

  def render(_props, state) do
    nori do
      div class: "root" do
        Nori.ExampleChildComponent.component class: "two" do
          state.count
        end

        Nori.ExampleChildComponent.component class: "one", key: "alpha" do
          "One"
        end

        Nori.ExampleChildComponent.component class: "three" do
          "Three"
        end
      end
    end
  end
end

defmodule Nori.ExampleChildComponent do
  use Nori.Component
  def mount(), do: %{}

  def render(props, _state) do
    nori do
      div(do: props.children)
    end
  end
end
