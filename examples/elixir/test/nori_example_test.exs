defmodule NoriExampleTest do
  use ExUnit.Case
  doctest NoriExample

  test "greets the world" do
    assert NoriExample.hello() == :world
  end
end
