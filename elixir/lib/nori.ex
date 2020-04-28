defmodule Nori do
  defmacro nori(do: block) do
    quote do
      import Kernel, except: [div: 2, use: 1, use: 2]
      import Nori.Html
      unquote(block)
    end
  end
end
