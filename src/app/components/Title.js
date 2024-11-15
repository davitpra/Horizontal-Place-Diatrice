import { Wraper } from "./Wraper";

export default function Title({title, observations = [], className = ""}) {
  return (
    <Wraper>
      <div className={`sm:flex sm:items-center ${className} my-4`}>
        <div className="sm:flex-auto">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <ul className="space-y-2 list-disc list-inside">
            {observations.map((observation, key) => (
              <li className="mt-2 text-sm text-gray-700" key={key}>{observation}</li>
            ))}      
          </ul>
        </div>
      </div>
    </Wraper>
  );
}
