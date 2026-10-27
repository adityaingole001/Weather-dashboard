import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("axios", () => ({ get: jest.fn() }));
const axios = jest.requireMock("axios");

test("shows current weather details and converts temperatures", async () => {
  axios.get.mockImplementation((url) =>
    Promise.resolve({
      data: url.includes("/forecast")
        ? { daily: [] }
        : {
            city: "Mumbai",
            country: "IN",
            condition: { description: "clear sky", icon_url: "" },
            temperature: { current: 28, humidity: 56 },
            wind: { speed: 3.5 },
          },
    })
  );

  render(<App />);

  expect(
    await screen.findByRole("heading", { name: /Mumbai, IN/i })
  ).toBeInTheDocument();
  expect(screen.getByText("56%")).toBeInTheDocument();
  expect(screen.getByText("3.5 m/s")).toBeInTheDocument();
  expect(screen.getByText("28")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Switch to Fahrenheit" }));

  expect(screen.getByText("82")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Switch to Celsius" })
  ).toBeInTheDocument();
});

test("switches between light and dark mode without changing the default theme", async () => {
  axios.get.mockImplementation((url) =>
    Promise.resolve({
      data: url.includes("/forecast")
        ? { daily: [] }
        : {
            city: "Mumbai",
            country: "IN",
            condition: { description: "clear sky", icon_url: "" },
            temperature: { current: 28, humidity: 56 },
            wind: { speed: 3.5 },
          },
    })
  );

  const { container } = render(<App />);
  const app = container.querySelector(".App");

  expect(app).toHaveAttribute("data-theme", "light");
  expect(
    await screen.findByRole("heading", { name: /Mumbai, IN/i })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
  expect(app).toHaveAttribute("data-theme", "dark");
  expect(
    screen.getByRole("button", { name: "Switch to light mode" })
  ).toHaveAttribute("aria-pressed", "true");

  fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
  expect(app).toHaveAttribute("data-theme", "light");
});
