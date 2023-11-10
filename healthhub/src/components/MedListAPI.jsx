import { useState } from 'react';

export default function MedListAPI() {
    
    try {
        new Def.Autocompleter.Prefetch('drug_strengths', []);
        new Def.Autocompleter.Search('rxterms',
            'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?ef=STRENGTHS_AND_FORMS');
        Def.Autocompleter.Event.observeListSelections('rxterms', function () {
            var drugField = $('#rxterms')[0];
            var autocomp = drugField.autocomp;
            var strengths =
                autocomp.getSelectedItemData()[0].data['STRENGTHS_AND_FORMS'];
            if (strengths)
                $('#drug_strengths')[0].autocomp.setListAndField(strengths, '');
        })
    }
    catch (error) {
        console.log(error)
    }

    return (
        <>
            <input type="text" id="rxterms" placeholder="Drug name" />
            <input type="text" id="drug_strengths" placeholder="Strength list" />
        </>
    )
}