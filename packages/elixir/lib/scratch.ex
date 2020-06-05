defmodule Nori.Example.Timer do
  use Nori.Component

  def mount() do
    :timer.send_interval(:timer.seconds(1), :tick)
    %{time: 0}
  end

  def render(_props, state) do
    nori do
      div do
        div do
          span(do: state.time)
        end

        component(Nori.Example.Child, onClick: fn _state, _evt -> "Hello" end)
      end
    end
  end

  def handle_info(:tick, state) do
    {:noreply, %{state | time: :os.system_time(:millisecond)}}
  end
end

defmodule Nori.Example.Child do
  use Nori.Component

  def mount(), do: %{}

  def render(props, _state) do
    nori do
      div(onClick: props.onClick, do: "Hello")
      div(onClick: fn s, _e -> s end)
    end
  end
end
