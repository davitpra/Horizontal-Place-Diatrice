import { Wraper } from "./Wraper";

export default function Title({ title, observations = [], className = "", buttonAction, button2Action, button, button2, button3Action, button3 }) {
  return (
    <div className={`px-4 sm:px-6 lg:px-8 xl:px-32`}>
      <div className={`md:flex md:items-center  ${className} my-4`}>
        <div className="sm:flex-auto">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <ul className="space-y-2 list-disc list-inside">
            {observations.map((observation, key) => (
              <li className="mt-2 text-sm text-gray-700" key={key}>{observation}</li>
            ))}
          </ul>
        </div>
        {button && (
          <div className="mt-4 md:mt-0 flex justify-end space-x-10 ">
            <div className="mt-2 shrink-0 flex space-x-4">
              <button
                type="button"
                className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  buttonAction();
                }
                }
              >
                {button}
              </button>
              {button2 && (
                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => {
                    button2Action();
                  }
                  }
                >
                  {button2}
                </button>
              )}
              {button3 && (
                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => {
                    button3Action();
                  }
                  }
                >
                  {button3}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
