defmodule NoriExample.Handler do
  use Riptide.Handler

  def handle_call("nori.render", %{}, state) do
    {:ok, pid} = Nori.Server.start_link(NoriExample.Test)
    {:reply, :ok, state}
  end

  def handle_info({:nori, :patch, patch}, state) do
    {:reply, {"nori.patch", Nori.JSON.encode_patch(patch)}, state}
  end
end

defmodule NoriExample.Test do
  use Nori.Component

  def mount() do
    %{}
  end

  def render(_props, state) do
    nori do
      div class: "flex justify-center " do
        div class: "w-full max-w-screen-xl px-6" do
          div(class: "h-8")
          NoriExample.Header.render()
        end
      end
    end
  end
end


defmodule NoriExample.Header do
  import Nori

  def render() do
    nori do
      div class: "flex items-center" do
        a href: "/" do
          div class: "flex items-center" do
            div style: "width: 40px" do
              img(src: "https://riptide.ironbay.co/img/logo.svg")
            end

            div class: "ml-6 font-500 text-2xl opacity-75" do
              "Riptide"
            end
          end
        end
      end
    end
  end
end
