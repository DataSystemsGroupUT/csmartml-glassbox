# Todo: move to constant
SDBW = ["sdbw", -1]
I_INDEX = ["i_index", 1]
BANFELD_RAFERTY = ["banfeld_raferty", -1]
MODIFIED_HUBERT_T = ["modified_hubert_t", 1]
DUNNS_INDEX = ["modified_hubtert_t", 1]
MCCLAIN_RAO = ["mcclain_rao", -1]
SCOTT_SYMONS = ["scott_symons", -1]
DAVIES_BOULDIN = ["davies_bouldin", -1]
PBM_INDEX = ["pbm_index", 1]
RATKOWSKY_LANCE = ["ratkowsky_lance", 1]


CVIS = {
    "cvi-1": BANFELD_RAFERTY,
    "cvi-2": MODIFIED_HUBERT_T,
    "cvi-3": I_INDEX,
    "cvi-4": MCCLAIN_RAO,
    "cvi-5": DUNNS_INDEX,
    "cvi-6": SCOTT_SYMONS,
    "cvi-7": SDBW,
    "cvi-8": DAVIES_BOULDIN,
    "cvi-9": PBM_INDEX,
    "cvi-10": RATKOWSKY_LANCE,
    "cvi-100": [SDBW, I_INDEX, BANFELD_RAFERTY],
    "cvi-101": [SDBW, MODIFIED_HUBERT_T, BANFELD_RAFERTY],
    "cvi-102": [I_INDEX, MODIFIED_HUBERT_T, BANFELD_RAFERTY],
    "cvi-103": [MCCLAIN_RAO, DUNNS_INDEX, BANFELD_RAFERTY],
    "cvi-104": [I_INDEX, SCOTT_SYMONS, BANFELD_RAFERTY],
    "cvi-105": [MCCLAIN_RAO, DUNNS_INDEX, BANFELD_RAFERTY],
}