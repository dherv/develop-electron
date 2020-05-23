const App = require("./app");
const testLibrary = require("@testing-library/dom");

const { fireEvent, within, waitFor, logDOM } = testLibrary;

jest.mock("./system/system", () => ({
  readDirectoryFilenames: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve(["d1", "d2"]))
    .mockImplementationOnce(() => Promise.resolve(["m1", "m2"]))
    .mockImplementationOnce(() => Promise.resolve(["p1", "p2"]))
    .mockImplementationOnce(() => Promise.resolve(["c1", "c2"])),
  buildAbsolutePath: jest.fn(() => "path1"),
}));

describe("application user interface", () => {
  beforeAll(() => {
    document.body.innerHTML = `
    <div id="root"></div>
    <main>
      <!-- <develop-folder></develop-folder> -->
      <aside id="develop-folder"></aside>
      <section>
        <nav>NAV</nav>
        <div id="app-grid" data-testid="app-grid">
          <button id="backButton">back</button>
        </div>
      </section>
    </main>
    `;
    const app = new App();
    app.init();
    app.initEvents();
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test("1. click one item on the develop list should open a folder list column", async () => {
    const { getByTestId, getByText, queryAllByText } = within(
      document.querySelector("main")
    );
    const listItem = getByText("d1");
    const grid = getByTestId("app-grid");
    fireEvent.click(listItem, { bubbles: true, composed: true });
    await waitFor(() => {});
    expect(grid.children).toHaveLength(2);
    expect(getByText("m2")).toBeDefined();
  });

  test("2. click an item on folder list column should open a new folder list column", async () => {
    const { getByTestId, getByText } = within(document.querySelector("main"));
    const listItem = getByText("m2");
    const grid = getByTestId("app-grid");
    fireEvent.click(listItem, { bubbles: true, composed: true });
    await waitFor(() => {});
    expect(grid.children).toHaveLength(3);
    expect(getByText("d2")).toBeDefined();
    expect(getByText("p2")).toBeDefined();
    expect(getByText("m2")).toBeDefined();
  });

  test("3. click an item on same column should replace the next folder list", async () => {
    const { getByTestId, getByText, queryByText } = within(
      document.querySelector("main")
    );
    const listItem = getByText("m1");
    const grid = getByTestId("app-grid");
    fireEvent.click(listItem, { bubbles: true, composed: true });
    await waitFor(() => {});
    expect(grid.children).toHaveLength(3);
    expect(getByText("d2")).toBeDefined();
    expect(getByText("c2")).toBeDefined();
    expect(getByText("m2")).toBeDefined();
    expect(queryByText("p2")).toBeNull();
  });

  test("4. click back button should remove the last column", async () => {
    const { getByTestId, getByText } = within(document.querySelector("main"));
    const grid = getByTestId("app-grid");
    const backButton = getByText("back");
    fireEvent.click(backButton, { bubbles: true });
    await waitFor(() => {});
    expect(grid.children).toHaveLength(2);
  });
});
