package anvilweb3

import (
	"encoding/hex"
	"math/big"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

// RPCEndpoint represents a JSON-RPC endpoint
type RPCEndpoint string

// AnvilRPC contains all supported Anvil RPC methods
type AnvilRPC struct{}

// RPC endpoints
const (
	// Standard Methods
	AnvilImpersonateAccount          RPCEndpoint = "anvil_impersonateAccount"
	AnvilStopImpersonatingAccount    RPCEndpoint = "anvil_stopImpersonatingAccount"
	AnvilAutoImpersonateAccount      RPCEndpoint = "anvil_autoImpersonateAccount"
	AnvilGetAutomine                 RPCEndpoint = "anvil_getAutomine"
	AnvilMine                        RPCEndpoint = "anvil_mine"
	AnvilDropTransaction             RPCEndpoint = "anvil_dropTransaction"
	AnvilReset                       RPCEndpoint = "anvil_reset"
	AnvilSetRpcUrl                   RPCEndpoint = "anvil_setRpcUrl"
	AnvilSetBalance                  RPCEndpoint = "anvil_setBalance"
	AnvilSetCode                     RPCEndpoint = "anvil_setCode"
	AnvilSetNonce                    RPCEndpoint = "anvil_setNonce"
	AnvilSetStorageAt                RPCEndpoint = "anvil_setStorageAt"
	AnvilSetCoinbase                 RPCEndpoint = "anvil_setCoinbase"
	AnvilSetLoggingEnabled          RPCEndpoint = "anvil_setLoggingEnabled"
	AnvilSetMinGasPrice             RPCEndpoint = "anvil_setMinGasPrice"
	AnvilSetNextBlockBaseFeePerGas  RPCEndpoint = "anvil_setNextBlockBaseFeePerGas"
	AnvilSetChainId                 RPCEndpoint = "anvil_setChainId"
	AnvilDumpState                  RPCEndpoint = "anvil_dumpState"
	AnvilLoadState                  RPCEndpoint = "anvil_loadState"
	AnvilNodeInfo                   RPCEndpoint = "anvil_nodeInfo"

	// Special Methods
	EvmSetAutomine                  RPCEndpoint = "evm_setAutomine"
	EvmSetIntervalMining           RPCEndpoint = "evm_setIntervalMining"
	EvmSnapshot                    RPCEndpoint = "evm_snapshot"
	EvmRevert                      RPCEndpoint = "evm_revert"
	EvmIncreaseTime               RPCEndpoint = "evm_increaseTime"
	EvmSetNextBlockTimestamp      RPCEndpoint = "evm_setNextBlockTimestamp"
	AnvilSetBlockTimestampInterval RPCEndpoint = "anvil_setBlockTimestampInterval"
	EvmSetBlockGasLimit           RPCEndpoint = "evm_setBlockGasLimit"
	AnvilRemoveBlockTimestampInterval RPCEndpoint = "anvil_removeBlockTimestampInterval"
	EvmMine                       RPCEndpoint = "evm_mine"
	AnvilEnableTraces             RPCEndpoint = "anvil_enableTraces"
	EthSendUnsignedTransaction    RPCEndpoint = "eth_sendUnsignedTransaction"

	// Methods based on Geth's documentation
	TxpoolStatus                   RPCEndpoint = "txpool_status"
	TxpoolInspect                 RPCEndpoint = "txpool_inspect"
	TxpoolContent                 RPCEndpoint = "txpool_content"
)

// Formatter functions
func toNormalizedAddress(addr interface{}) common.Address {
	switch v := addr.(type) {
	case string:
		return common.HexToAddress(v)
	case common.Address:
		return v
	default:
		return common.Address{}
	}
}

func toHexIfBytes(data interface{}) string {
	switch v := data.(type) {
	case []byte:
		return "0x" + hex.EncodeToString(v)
	case string:
		if strings.HasPrefix(v, "0x") {
			return v
		}
		return "0x" + v
	default:
		return ""
	}
}

func toHexIfInteger(num interface{}) string {
	switch v := num.(type) {
	case int64:
		return hexutil.EncodeUint64(uint64(v))
	case uint64:
		return hexutil.EncodeUint64(v)
	case *big.Int:
		if v != nil {
			return hexutil.EncodeBig(v)
		}
	}
	return "0x0"
}

// ResetOptions represents the options for anvil_reset
type ResetOptions struct {
	JsonRpcURL  string `json:"json_rpc_url"`
	BlockNumber string `json:"block_number"`
}

// FormatRequest formats the request parameters based on the RPC method
func FormatRequest(method RPCEndpoint, params ...interface{}) []interface{} {
	switch method {
	case AnvilImpersonateAccount, AnvilStopImpersonatingAccount:
		if len(params) > 0 {
			return []interface{}{toNormalizedAddress(params[0])}
		}
	case AnvilSetBalance:
		if len(params) > 1 {
			return []interface{}{
				toNormalizedAddress(params[0]),
				toHexIfInteger(params[1]),
			}
		}
	case AnvilSetCode:
		if len(params) > 1 {
			return []interface{}{
				toNormalizedAddress(params[0]),
				toHexIfBytes(params[1]),
			}
		}
	case AnvilSetStorageAt:
		if len(params) > 2 {
			return []interface{}{
				toNormalizedAddress(params[0]),
				toHexIfInteger(params[1]),
				toHexIfBytes(params[2]),
			}
		}
	}
	return params
}

// FormatResponse formats the response based on the RPC method
func FormatResponse(method RPCEndpoint, response interface{}) interface{} {
	switch method {
	case AnvilGetAutomine:
		if b, ok := response.(bool); ok {
			return b
		}
	case AnvilDropTransaction:
		if s, ok := response.(string); ok {
			return common.HexToHash(s)
		}
	case AnvilSetStorageAt:
		if b, ok := response.(bool); ok {
			return b
		}
	}
	return response
} 