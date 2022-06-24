import { Component, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";

const per_day = {
  viande_rouge: 121.5,
  viande_blanche: 121.5,
  os_charnus: 243,
  poisson: 92,
  foie: 26,
  autres_abats: 26,
};

type Plop = typeof per_day;

const App: Component = () => {
  const [alreadyHave, setAlreadyHave] = createStore({
    viande_blanche: 0,
    viande_rouge: 0,
    autres_abats: 0,
    foie: 0,
    os_charnus: 0,
    poisson: 0,
  } as Plop);

  const [startDate, setStartDate] = createSignal(new Date());
  const [endDate, setEndDate] = createSignal(new Date());

  const updtateAlreadyHave = (
    event: InputEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    }
  ) => {
    setAlreadyHave((old) => ({
      ...old,
      [event.currentTarget.name]: +event.currentTarget.value,
    }));
  };

  const total = () => {
    const daysNb = Math.ceil(
      ((endDate() as any) - (startDate() as any)) / (1000 * 60 * 60 * 24)
    );

    return Object.entries(per_day).map(([name, value]) => [
      name,
      value * daysNb - alreadyHave[name],
    ]);
  };

  const formatIngredientName = (name) => {
    return name
      .split("_")
      .map((word, index) =>
        index === 0
          ? word.at(0).toUpperCase() + word.slice(1).toLowerCase()
          : word.toLowerCase()
      )
      .join(" ");
  };

  return (
    <div class="w-screen h-screen bg-slate-800 text-slate-100 grid place-items-center wrap overflow-auto">
      <div class="container">
        <form
          class="rounded shadow-lg bg-slate-700 p-4 grid md:grid-cols-2 gap-4 divide-y md:divide-y-0"
          onSubmit={(e) => e.preventDefault()}
        >
          <fieldset class="flex flex-col space-y-2">
            <legend class="float-left text-lg font-bold">
              Quantité possédées (ce qu'on a déjà)
            </legend>
            <For each={Object.keys(per_day)}>
              {(name) => (
                <div class="flex flex-col">
                  <label for={name}>{formatIngredientName(name)} (g)</label>
                  <input
                    class="text-slate-900 px-2 py-1 rounded"
                    type="number"
                    value={alreadyHave[name]}
                    name={name}
                    id={name}
                    onInput={updtateAlreadyHave}
                  />
                </div>
              )}
            </For>
          </fieldset>
          <div class="space-y-2 divide-y md:divide-y-0">
            <fieldset class="flex flex-col space-y-2">
              <legend class="float-left text-lg font-bold">Dates</legend>

              <div class="flex flex-col">
                <label for="startDate">Début</label>
                <input
                  class="text-slate-900 px-2 py-1 rounded"
                  type="date"
                  value={startDate().toISOString().split("T")[0]}
                  max={endDate().toISOString().split("T")[0]}
                  name="startDate"
                  id="startDate"
                  onInput={(e) => setStartDate(new Date(e.currentTarget.value))}
                />
              </div>

              <div class="flex flex-col">
                <label for="endDate">Fin</label>
                <input
                  class="text-slate-900 px-2 py-1 rounded"
                  type="date"
                  value={endDate().toISOString().split("T")[0]}
                  min={startDate().toISOString().split("T")[0]}
                  name="endDate"
                  id="endDate"
                  onInput={(e) => setEndDate(new Date(e.currentTarget.value))}
                />
              </div>
            </fieldset>

            <section>
              <h2 class="text-lg font-bold">Quantité à acheter</h2>
              <output>
                <ul>
                  <For each={total()}>
                    {([name, value]) => (
                      <li>
                        {formatIngredientName(name)} : {(+(value as number).toFixed(0)).toLocaleString()}g
                      </li>
                    )}
                  </For>
                </ul>
              </output>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
