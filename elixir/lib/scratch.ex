defmodule Nori.Scratch do
  import Nori

  def render() do
    nori do
      div do
        for x <- 1..:rand.uniform(100), do: my_component(x)

        h1(do: "HELLO")
      end
    end
  end

  def my_component(count) do
    nori do
      div([class: "red"], do: count)
    end
  end
end
