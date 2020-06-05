defmodule Nori.Server do
  use GenServer
  import Nori

  def start_link(component) do
    GenServer.start_link(__MODULE__, [component, [self()]])
  end

  def init([component, pids]) do
    send(self(), :render)

    {:ok,
     %{
       component: component,
       ctx: %{callbacks: %{}, states: %{}},
       dom: nil,
       subscribers: MapSet.new(pids)
     }}
  end

  def subscribe(server, pid), do: GenServer.call(server, {:subscribe, pid})

  def handle_call({:subscribe, pid}, _from, state) do
    {:reply, :ok, %{state | subscribers: MapSet.put(state.subscribers, pid)}}
  end

  def handle_info(:render, state) do
    {next, next_ctx} =
      Nori.Node.render(
        nori do
          component(state.component)
        end,
        state.ctx
      )

    patch = Nori.Node.diff(state.dom, next)

    if patch !== [] do
      Enum.each(state.subscribers, fn pid ->
        send(pid, {:nori, :patch, patch})
      end)
    end

    {:noreply, %{state | dom: next, ctx: next_ctx}}
  end

  def handle_info(msg, state) do
    {:noreply, next} = state.component.handle_info(msg, Kernel.get_in(state.ctx, [:states, [0]]))
    send(self(), :render)
    {:noreply, %{state | ctx: Kernel.put_in(state.ctx, [:states, [0]], next)}}
  end
end
