defmodule Server.Command do
  use Riptide.Command

  def handle_call(%{action: "nori.init"}, _from, state) do
    data = %{
      url: "/dashboard"
    }

    next = Server.UI.render(data)

    reply =
      nil
      |> Nori.diff(next)
      |> Nori.JSON.encode_patch()

    {:reply, reply, %{dom: next, data: data}}
  end

  def handle_call(
        %{action: "nori.event", body: %{"handler" => handler, "event" => event}},
        _from,
        state
      ) do
    {:ok, data} = Nori.Callback.trigger(handler, event, state.data)
    next = Server.UI.render(data)

    patch =
      state.dom
      |> Nori.diff(next)
      |> Nori.JSON.encode_patch()

    {:reply, patch, %{state | dom: next, data: data}}
  end

  def handle_call(msg, _from, state) do
    IO.inspect(msg)
    {:error, :invalid, state}
  end
end
