import {Injectable} from '@angular/core';
import {isPresent, normalizeAccent} from '@jscrpt/common';

import {KodPopisValue} from '../../misc/types';
import data from './data.json';

/**
 * Service for obtaining data for dynamic select demo
 */
@Injectable()
export class DataService
{
    //######################### public methods - API #########################

    /**
     * Gets data for dynamic select demo
     * @param query - Query for which data should be obtained
     */
    public getData(query: string): Promise<KodPopisValue[]>
    {
        let resolve: (value: KodPopisValue[]) => void;
        const result = new Promise<KodPopisValue[]>(res => resolve = res);
        const normalize = (value: string) => isPresent(value) ? normalizeAccent(value) : value;
        const compare = (source: string, target: string) => normalize(source).match(new RegExp(normalize(target), 'i'));

        setTimeout(() =>
        {
            resolve(data.filter(item => compare(item.popis, query)));
        }, Math.random() * 400 + 50);

        return result;
    }
}
