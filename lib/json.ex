defmodule Nori.JSON do
  def encode_patch(patches) do
    patches
    |> Enum.map(fn
      {op, path, data} -> [op_code(op), path, process(data)]
    end)
  end

  def process(item = %Nori{}) do
    item
    |> Nori.to_html()
    |> IO.iodata_to_binary()
  end

  def process(data) when is_tuple(data), do: Tuple.to_list(data)
  def process(data), do: data

  defp op_code(op) do
    case op do
      :element_create -> 0
      :element_delete -> 1
      :attribute_set -> 2
      :attribute_delete -> 3
      :text_set -> 4
      :text_delete -> 5
    end
  end
end
