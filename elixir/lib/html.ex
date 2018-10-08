defmodule Nori.HTML do
  def style(input) do
    {:style,
     input
     |> Enum.map(fn {key, value} -> [Atom.to_string(key), ": ", value, ";"] end)
     |> IO.iodata_to_binary()}
  end

  def class(input) do
    {:class,
     input
     |> Stream.filter(fn {_, value} -> value end)
     |> Enum.map(fn {key, value} -> Atom.to_string(key) end)
     |> Enum.join(" ")}
  end
end
