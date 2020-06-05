defmodule Nori.JSON do
  def encode_patch(patches) do
    Enum.map(patches, fn
      {op, path, data} -> [
        op_code(op),
        Enum.join(path, "."),
        process(data)
      ]
    end)
  end

  def process(item = %Nori.Node{}) do
    item
    |> Nori.Node.to_html()
    |> IO.iodata_to_binary()
  end

  def process(data) when is_tuple(data), do: process(Tuple.to_list(data))
  def process(data) when is_list(data), do: Enum.map(data, &to_string/1)
  def process(data), do: data

  defp op_code(op) do
    case op do
      # Element
      :element_create -> 0
      :element_delete -> 1
      # Prop
      :prop_create -> 3
      :prop_delete -> 4
      :prop_change -> 5
      # Text
      :text_create -> 6
      :text_delete -> 7
      :text_change -> 8
    end
  end
end
