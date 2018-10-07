defmodule Nori.Callback do
  def add(fun, args \\ []) do
    {_, key} = Function.info(fun, :uniq)
    key = inspect(key)
    Process.put({:handler, key}, {fun, args})
    key
  end

  def trigger(key, event, state) do
    {fun, args} = Process.get({:handler, key})
    {:ok, data} = apply(fun, args ++ [event, state])
  end
end
