defmodule NoriTest do
  use ExUnit.Case
  doctest Nori

  test "simple tree" do
    assert Nori.element("div", [
             Nori.element("div", [class: "red"], "hello")
           ]) === %Nori{
             attributes: [],
             children: [
               %Nori{
                 attributes: [class: "red"],
                 children: ["hello"],
                 key: 0,
                 name: "div"
               }
             ],
             key: 0,
             name: "div"
           }
  end

  test "attribute set" do
    old = Nori.element("div", [])
    next = Nori.element("div", [class: "red"], [])
    assert Nori.diff(old, next) == [{:attribute_set, [0], {:class, "red"}}]
  end

  test "attribute delete" do
    old = Nori.element("div", [class: "red"], [])
    next = Nori.element("div", [])
    assert Nori.diff(old, next) == [{:attribute_delete, [0], :class}]
  end

  test "element create" do
    old = Nori.element("div", [])

    insert = Nori.element("div", [])

    next =
      Nori.element("div", [
        insert
      ])

    assert Nori.diff(old, next) == [{:element_create, [0, 0], insert}]
  end

  test "element delete" do
    old =
      Nori.element("div", [
        Nori.element("div", ["hello"])
      ])

    next = Nori.element("div", [])

    assert Nori.diff(old, next) == [{:element_delete, [0, 0], nil}]
  end
end
