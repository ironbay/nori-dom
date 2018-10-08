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
    element("div", [
      element("div", [class: "flex pad-h6 m-pad-h8 pad-v7 align-center bg-white"], [
        element("div", [class: "uppercase weight-6 mgn-r8"], "My Company"),
        element("div", [class: "flex"], [
          link("/dashboard", "Dashboard", state),
          link("/users", "Users", state)
        ])
      ]),
      case state.url do
        "/users" -> render_users(state)
        "/dashboard" -> element("div", [], [])
      end
    ])
  end

  def render_users(state) do
    element("div", [class: "pad-h8"], [
      element("input", class: "weight-5", placeholder: "Search...")
    ])
  end

  def link(to, children, state) do
    element("div", [class: "mgn-r6 uppercase size-3 weight-6 fg-black block cursor-pointer"], [
      element(
        "a",
        [
          class("fg-blue": to === state.url),
          style(transition: "250ms all"),
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

  def handle_search(msg, state) do
    {:ok, msg["value"]}
  end
end
