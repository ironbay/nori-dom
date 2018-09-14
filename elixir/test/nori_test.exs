defmodule NoriTest do
  use ExUnit.Case
  doctest Nori

  test "greets the world" do
    assert Nori.hello() == :world
  end
end
