import { useAtom } from "jotai";
import { appMode } from "../utils/jotai";

export default function EnvironmentSelector() {
  const [environment, setEnvironment] = useAtom(appMode);

  const handleEnvironmentChange = (event) => {
    setEnvironment(event.target.value);
  };

  return (
    <div className="flex items-center space-x-5">
      <label>Data Source:</label>
      <select
        value={environment}
        onChange={handleEnvironmentChange}
      >
        <option value="test">Test</option>
        <option value="live">Live</option>
      </select>
    </div>
  );
}