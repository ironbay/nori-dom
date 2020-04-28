defmodule Nori.Server do
  use GenServer

  def start_link(component) do
    GenServer.start_link(__MODULE__, component)
  end

  def init(component) do
    send(self(), :render)

    {:ok,
     %{
       component: component,
       data: component.mount(),
       dom: nil,
       subscribers: MapSet.new()
     }}
  end

  def subscribe(server, pid), do: GenServer.call(server, {:subscribe, pid})

  def handle_call({:subscribe, pid}, _from, state) do
    {:reply, :ok, %{state | subscribers: MapSet.put(state.subscribers, pid)}}
  end

  def handle_info(:render, state) do
    next = state.component.component(state.data)
    diff = Nori.diff(state.dom, next)
    IO.inspect(diff)

    Enum.each(state.subscribers, fn pid ->
      send(pid, {:nori, :diff, diff})
    end)

    {:noreply, %{state | dom: next}}
  end

  def handle_info(msg, state) do
    {:noreply, data} = state.component.handle_info(msg, state.data)
    send(self(), :render)
    {:noreply, %{state | data: data}}
  end
end
