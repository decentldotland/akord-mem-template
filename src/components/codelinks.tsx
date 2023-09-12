export default function CodeLinks() {
  return (
    <div className="flex gap-x-4">
      <a
        className="underline hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
        href="https://gist.github.com/charmful0x/7908734530a8551c11b02e0b553abbd3#file-akord-js"
      >
        Contract File ↗
      </a>
      <a
        className="underline hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
        href="https://gist.github.com/charmful0x/7908734530a8551c11b02e0b553abbd3#file-akord-json"
      >
        State File ↗
      </a>
      <a
        className="underline hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
        href="https://mem.tech/ide?launchExample=7908734530a8551c11b02e0b553abbd3"
      >
        Deploy Your Own ↗
      </a>
    </div>
  );
}
