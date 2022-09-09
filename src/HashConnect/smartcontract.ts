import abi from "./abi.json";
export const ABI = abi;

export const bytcode: string =
  "608060405234801561001057600080nfd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f50146d0e3c60aa1d17a70635b05494f864e86144a2201275021014fbf08bafe260008054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040516100a091906100ee565b60405180910390a1610109565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100d8826100ad565b9050919050565b6100e8816100cd565b82525050565b600060208201905061010360008301846100df565b92915050565b610b12806101186000396000f3fe6080604052600436106100705760003560e01c80634986f33b1161004e5780634986f33b146100ea57806378f9d27714610127578063bff3199614610143578063f8b2cb4f1461016c57610070565b806327e235e314610075578063297ecd44146100b257806341228803146100ce575b600080fd5b34801561008157600080fd5b5061009c6004803603810190610097919061073d565b6101a9565b6040516100a99190610783565b60405180910390f35b6100cc60048036038101906100c79190610840565b6101c1565b005b6100e860048036038101906100e391906108a7565b61034c565b005b3480156100f657600080fd5b50610111600480360381019061010c919061073d565b6104c6565b60405161011e9190610783565b60405180910390f35b610141600480360381019061013c91906108fa565b6104de565b005b34801561014f57600080fd5b5061016a6004803603810190610165919061073d565b610612565b005b34801561017857600080fd5b50610193600480360381019061018e919061073d565b610691565b6040516101a09190610783565b60405180910390f35b60016020528060005260406000206000915090505481565b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541161020c57600080fd5b801561026d5781600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546102619190610969565b925050819055506102c4565b81600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546102bc9190610969565b925050819055505b8273ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f1935050505015801561030a573d6000803e3d6000fd5b507faf10290dc59f03f29d34958fe80caa172155425971c05210968bea3bd659916183858460405161033e93929190610a0b565b60405180910390a150505050565b80156103e65781600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546103a19190610a42565b925050819055507f543ba50a5eec5e6178218e364b1d0f396157b3c8fa278522c2cb7fd99407d47483836040516103d9929190610a98565b60405180910390a16104c1565b81600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541161043157600080fd5b81600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104809190610969565b925050819055507feaff4b37086828766ad3268786972c0cd24259d4c87a80f9d3963a3c3d999b0d83836040516104b8929190610a98565b60405180910390a15b505050565b60026020528060005260406000206000915090505481565b80600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541161052957600080fd5b80600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105789190610969565b9250508190555080600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105ce9190610a42565b925050819055507f84d20de95b1cabd9535744a0ce377618ce41db390322ff5d829444ccde2a90df8282604051610606929190610a98565b60405180910390a15050565b7f3d04fb94919fdfa7708320cdebdf093992d88d792b3d5f4144c364cda00129c6816040516106419190610ac1565b60405180910390a16000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061070a826106df565b9050919050565b61071a816106ff565b811461072557600080fd5b50565b60008135905061073781610711565b92915050565b600060208284031215610753576107526106da565b5b600061076184828501610728565b91505092915050565b6000819050919050565b61077d8161076a565b82525050565b60006020820190506107986000830184610774565b92915050565b60006107a9826106df565b9050919050565b6107b98161079e565b81146107c457600080fd5b50565b6000813590506107d6816107b0565b92915050565b6107e58161076a565b81146107f057600080fd5b50565b600081359050610802816107dc565b92915050565b60008115159050919050565b61081d81610808565b811461082857600080fd5b50565b60008135905061083a81610814565b92915050565b6000806000806080858703121561085a576108596106da565b5b600061086887828801610728565b9450506020610879878288016107c7565b935050604061088a878288016107f3565b925050606061089b8782880161082b565b91505092959194509250565b6000806000606084860312156108c0576108bf6106da565b5b60006108ce86828701610728565b93505060206108df868287016107f3565b92505060406108f08682870161082b565b9150509250925092565b60008060408385031215610911576109106106da565b5b600061091f85828601610728565b9250506020610930858286016107f3565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006109748261076a565b915061097f8361076a565b9250828210156109925761099161093a565b5b828203905092915050565b6000819050919050565b60006109c26109bd6109b8846106df565b61099d565b6106df565b9050919050565b60006109d4826109a7565b9050919050565b60006109e6826109c9565b9050919050565b6109f6816109db565b82525050565b610a05816106ff565b82525050565b6000606082019050610a2060008301866109ed565b610a2d60208301856109fc565b610a3a6040830184610774565b949350505050565b6000610a4d8261076a565b9150610a588361076a565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610a8d57610a8c61093a565b5b828201905092915050565b6000604082019050610aad60008301856109fc565b610aba6020830184610774565b9392505050565b6000602082019050610ad660008301846109fc565b9291505056fea264697066735822122078f27760c4478500607cca1ab4bd129cd17a1c842d9cd301121689d5589196f564736f6c634300080c0033";
