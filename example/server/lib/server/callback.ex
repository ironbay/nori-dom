defmodule Nori.Callback do
  def add(fun, args \\ []) do
    key =
      fun
      |> Function.info()
      |> :erlang.phash2()
      |> inspect()

    Process.put({:handler, key}, {fun, args})

    key
  end

  def trigger(key, event, state) do
    {fun, args} = Process.get({:handler, key})
    {:ok, data} = apply(fun, args ++ [event, state])
  end
end
