defmodule Server.Socket do
  @behaviour :cowboy_websocket

  def init(req, _state) do
    {:cowboy_websocket, req,
     %{
       dom: nil,
       data: 0
     }}
  end

  def terminate(_reason, _req, _state) do
    :ok
  end

  def websocket_handle({:text, "init"}, state) do
    next = Server.UI.render(state.data)
    patch = Nori.diff(nil, next)

    json =
      patch
      |> Nori.JSON.encode_patch()
      |> Poison.encode!()

    {:reply, {:text, json}, Map.put(state, :dom, next)}
  end

  def websocket_handle({:text, input}, state) do
    %{"handler" => handler, "data" => data} = Poison.decode!(input)
    [mod, fun] = String.split(handler, " ")
    {:ok, data} = apply(String.to_atom(mod), String.to_atom(fun), [data, state.data])

    IEx.Helpers.r(Server.UI)
    next = Server.UI.render(data)
    patch = Nori.diff(state.dom, next)

    json =
      patch
      |> Nori.JSON.encode_patch()
      |> Poison.encode!()

    {:reply, {:text, json},
     %{
       dom: next,
       data: data
     }}
  end
end
