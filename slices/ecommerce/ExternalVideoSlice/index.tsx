import React from 'react'
import { ExternalVideoSliceSlice } from '../../../types.generated'

const ExternalVideoSlice = ({ slice } : {slice : ExternalVideoSliceSlice}) => (
  <section>
   <div className="section-header">
      <div className="header-video m-hide bg-black voile-noir">
        {
          slice.primary.video?
          <video className="h-screen w-screen fp-engine" playsInline webkit-playsinline loop autoPlay={true} muted={true} src={slice.primary.video.video_url!} />
          :<video className="h-screen w-screen fp-engine" playsInline webkit-playsinline loop autoPlay={true} muted={true} src="https://vod.fl.freecaster.net/vod/lvmh/wG1Ekry2k2_1080p.mp4" />
        }
      </div>
  </div>
  </section>
)

export default ExternalVideoSlice

