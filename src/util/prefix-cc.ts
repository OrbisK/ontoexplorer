import {SparqlClass} from "@/model/SparqlClass";

/**
 * Loads prefixes from prefix.cc with cache in localStorage, returns after max. 1 second
 */
export async function loadPrefixes() {

  return new Promise<void>(resolve => {
    let prefixesLoaded = false;

    try {
      if (localStorage.getItem('prefixes')) {
        const storageObj = JSON.parse(localStorage.getItem('prefixes')!);
        if (storageObj.validUntil > Date.now()) {
          for (const [label, iri] of Object.entries(storageObj.prefixMap)) {
            if (typeof iri === "string") {
              SparqlClass.prefixMap.set(label, iri);
            }
          }
          prefixesLoaded = true;
          resolve();
        }
      }
    } catch (e) {
      localStorage.removeItem('prefixes');
    }

    if (!prefixesLoaded) {
      const timeoutController = new AbortController()
      setTimeout(() => timeoutController.abort(), 1000)
      fetch('https://prefix.cc/popular/all.file.json', {signal: timeoutController.signal})
        .then(res => res.json())
        .then(data => {
          for (const [label, iri] of Object.entries(data)) {
            if (typeof iri === "string") {
              SparqlClass.prefixMap.set(label, iri);
            }
          }
          localStorage.setItem('prefixes', JSON.stringify({
            validUntil: Date.now() + 24 * 60 * 60 * 1000,
            prefixMap: data
          }));
          resolve();
        })
        .catch(err => {
          try {
            if (localStorage.getItem('prefixes')) {
              for (const [label, iri] of Object.entries(JSON.parse(localStorage.getItem('prefixes')!).prefixMap)) {
                if (typeof iri === "string") {
                  SparqlClass.prefixMap.set(label, iri);
                }
              }
            }
          } catch (e) {
            localStorage.removeItem('prefixes');
          }
          resolve();
        });
    }
  });

}