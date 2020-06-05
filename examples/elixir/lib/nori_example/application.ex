defmodule NoriExample.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Starts a worker by calling: NoriExample.Worker.start_link(arg)
      # {NoriExample.Worker, arg}
      {Riptide.Websocket.Server, %{port: 12000,handlers: [NoriExample.Handler]}}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: NoriExample.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
