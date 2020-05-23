const mock = jest.fn().mockImplementation(() => {
  return {
    default: {
      __esModule: true,
      readDirectoryFilenames: jest.fn(() => Promise.resolve(["m1", "m2"])),
      buildAbsolutePath: jest.fn(() => "build me"),
    },
  };
});

module.exports = mock;
