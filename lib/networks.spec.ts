import { expect } from 'chai'
import { networks } from './networks'

describe('networks', function() {
  it('rejects bad chain ids', function() {
    const badChainId = 6666966696666
    expect(() => networks(badChainId)).to.throw(`bad chainId, ${badChainId}`)
  })
})
