defmodule Server.UI do
  import Nori
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

  def render(state) do
    # filtered = Enum.filter(@colors, fn color -> String.contains?(color, state) end)
    # element("div", [class: "pad-4 size-4"], [
    #   element("input",
    #     placeholder: "Search...",
    #     type: "text",
    #     on_keyup: &handle_search/2,
    #     autofocus: ""
    #   ),
    #   element("div", [class: "mgn-t1 line-5"], [
    #     if(length(filtered) === 0, do: "No results..."),
    #     Enum.map(filtered, &result/1)
    #   ])
    # ])
    element("div", [class: "flex pad-h6 m-pad-h8 pad-v7 align-center bg-white"], [
      element("div", [class: "uppercase weight-6 mgn-r8"], "My Company"),
      element("div", [class: "flex"], [
        link("/dashboard", "Dashboard", state),
        link("/users", "Users", state)
      ])
    ])
  end

  def link(to, children, state) do
    element("div", [class: "mgn-r6 uppercase size-3 weight-6 fg-black block cursor-pointer"], [
      element(
        "a",
        [
          class("fg-blue": to === state.url),
          href: to,
          on_click: fn msg, state -> handle_click(to, msg, state) end
        ],
        [children]
      )
    ])
  end

  def handle_click(to, msg, state) do
    {:ok, Map.put(state, :url, to)}
  end

  def result(color) do
    element("div", [style(color: color), class: "pad-v3 pad-h4 border-1"], color)
  end

  def handle_search(msg, state) do
    {:ok, msg["value"]}
  end
end
