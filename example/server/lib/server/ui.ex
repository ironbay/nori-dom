defmodule Server.UI do
  alias Nori.Callback
  alias Nori.HTML, as: H
  import Nori.HTML

  @colors [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "violet",
    "magenta",
    "lime",
    "indigo"
  ]

  def render2() do
    div do
      span do
        "foo"
      end
    end
  end

  def render(state) do
    filtered = Enum.filter(@colors, fn color -> String.contains?(color, state) end)

    section([], [
      input(placeholder: "Search...", on_keyup: &handle_search/2),
      section(
        [style: style("padding-top": "5px")],
        [
          if(length(filtered) === 0, do: "No results"),
          Enum.map(filtered, &section([style: "color: #{&1};"], &1))
        ]
      )
    ])
  end

  def handle_search(msg, state) do
    {:ok, msg["value"]}
  end

  def handler(fun, args \\ []) do
    {_, key} = Function.info(fun, :uniq)
    key = inspect(key)
    Process.put({:handler, key}, {fun, args})
  end
end
