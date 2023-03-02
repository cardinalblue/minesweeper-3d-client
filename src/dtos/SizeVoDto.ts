import { SizeVo } from '@/models/valueObjects';

type SizeVoDto = {
  width: number;
  height: number;
};

function parseSizeVoDto(SizeVoDto: SizeVoDto): SizeVo {
  return SizeVo.new(SizeVoDto.width, SizeVoDto.height);
}

export type { SizeVoDto };
export { parseSizeVoDto };
