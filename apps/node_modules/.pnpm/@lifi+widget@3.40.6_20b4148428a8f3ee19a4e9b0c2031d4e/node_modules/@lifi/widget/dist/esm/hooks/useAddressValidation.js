import { getNameServiceAddress } from '@lifi/sdk';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getChainTypeFromAddress } from '../utils/chainType.js';
export var AddressType;
(function (AddressType) {
    AddressType[AddressType["Address"] = 0] = "Address";
    AddressType[AddressType["NameService"] = 1] = "NameService";
})(AddressType || (AddressType = {}));
export const useAddressValidation = () => {
    const { t } = useTranslation();
    const { mutateAsync: validateAddress, isPending: isValidating } = useMutation({
        mutationFn: async ({ value, chainType, chain, }) => {
            try {
                if (!value) {
                    throw new Error();
                }
                const _chainType = getChainTypeFromAddress(value);
                if (_chainType) {
                    return {
                        address: value,
                        addressType: AddressType.Address,
                        chainType: _chainType,
                        isValid: true,
                    };
                }
                const address = await getNameServiceAddress(value, chainType);
                if (address) {
                    const _chainType = getChainTypeFromAddress(address);
                    if (_chainType) {
                        return {
                            address: address,
                            addressType: AddressType.NameService,
                            chainType: _chainType,
                            isValid: true,
                        };
                    }
                }
                throw new Error();
            }
            catch (_) {
                return {
                    isValid: false,
                    error: t('error.title.walletAddressInvalid', chain?.name
                        ? { context: 'chain', chainName: chain.name }
                        : undefined),
                };
            }
        },
    });
    return {
        validateAddress,
        isValidating,
    };
};
//# sourceMappingURL=useAddressValidation.js.map