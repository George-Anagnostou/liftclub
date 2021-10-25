import { screen, render } from "@testing-library/react";
import TeamBuilder from "../../../../components/builder/team";

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { team: "614d7332314c3d2f911d2eeb" },
  }),
}));

describe("TeamBuilder", () => {
  test("team name input responds to user input", () => {
    render(<TeamBuilder />);
  });
});
