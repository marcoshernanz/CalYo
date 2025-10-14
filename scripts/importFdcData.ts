async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Pass path to the bulk JSON file.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
