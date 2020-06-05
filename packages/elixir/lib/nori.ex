defmodule Nori do
  defmacro nori(do: block) do
    quote do
      import Kernel, except: [div: 2, use: 1, use: 2]
      import Nori.Html
      import Nori.Element, only: [element: 1, element: 2, element: 3]
      import Nori.Component, only: [component: 1, component: 2, component: 3]

      unquote(block)
    end
  end
end
