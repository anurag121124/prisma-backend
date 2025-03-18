import { expect } from "chai";

// Function to test
export const sayHello = (name?: string): string => {
  return name ? `Hello, ${name}!` : "Hello, World!";
};

// Test cases
describe("sayHello Function Tests", () => {
  it("should return 'Hello, World!' when no name is provided", () => {
    expect(sayHello()).to.equal("Hello, World!");
  });

  it("should return 'Hello, Anurag!' when the name 'Anurag' is provided", () => {
    expect(sayHello("Anurag")).to.equal("Hello, Anurag!");
  });

  it("should return 'Hello, John!' when the name 'John' is provided", () => {
    expect(sayHello("John")).to.equal("Hello, John!");
  });

  it("should be case-sensitive and return 'Hello, aNuRaG!'", () => {
    expect(sayHello("aNuRaG")).to.equal("Hello, aNuRaG!");
  });
  it("should return 'Hello, World!' when no name is provided", () => {
    expect(sayHello()).to.equal("Hello, World!");
  });

  it("should return 'Hello, Anurag!' when the name 'Anurag' is provided", () => {
    expect(sayHello("Anurag")).to.equal("Hello, Anurag!");
  });

  it("should return 'Hello, John!' when the name 'John' is provided", () => {
    expect(sayHello("John")).to.equal("Hello, John!");
  });

  it("should be case-sensitive and return 'Hello, aNuRaG!'", () => {
    expect(sayHello("aNuRaG")).to.equal("Hello, aNuRaG!");
  });
  it("should return 'Hello, World!' when no name is provided", () => {
    expect(sayHello()).to.equal("Hello, World!");
  });

  it("should return 'Hello, Anurag!' when the name 'Anurag' is provided", () => {
    expect(sayHello("Anurag")).to.equal("Hello, Anurag!");
  });

  it("should return 'Hello, John!' when the name 'John' is provided", () => {
    expect(sayHello("John")).to.equal("Hello, John!");
  });

  it("should be case-sensitive and return 'Hello, aNuRaG!'", () => {
    expect(sayHello("aNuRaG")).to.equal("Hello, aNuRaG!");
  });
  it("should return 'Hello, World!' when no name is provided", () => {
    expect(sayHello()).to.equal("Hello, World!");
  });

  it("should return 'Hello, Anurag!' when the name 'Anurag' is provided", () => {
    expect(sayHello("Anurag")).to.equal("Hello, Anurag!");
  });

  it("should return 'Hello, John!' when the name 'John' is provided", () => {
    expect(sayHello("John")).to.equal("Hello, John!");
  });

  it("should be case-sensitive and return 'Hello, aNuRaG!'", () => {
    expect(sayHello("aNuRaG")).to.equal("Hello, aNuRaG!");
  });
});
