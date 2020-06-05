defmodule Nori.Macro do
  def parse_children(input) do
    case input do
      {:__block__, _, elems} -> elems
      [] -> []
      result -> [result]
    end
  end
end
