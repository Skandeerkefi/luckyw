import { Button } from "@/components/ui/button";
import { Clock, Users, Gift } from "lucide-react";

export type GiveawayStatus = "active" | "completed" | "upcoming";

interface GiveawayCardProps {
	id: string;
	title: string;
	prize: string;
	endTime: string;
	participants: number;
	status: GiveawayStatus;
	isEntered?: boolean;
	onEnter?: (id: string) => void;
}

export function GiveawayCard({
	id,
	title,
	prize,
	endTime,
	participants,
	status,
	isEntered = false,
	onEnter,
}: GiveawayCardProps) {
	return (
		<div className='overflow-hidden rounded-lg border border-[#F1A82F] bg-[#000000]'>
			{/* Accent top bar */}
			<div className='h-3 bg-gradient-to-r from-[#F1A82F] via-[#F1A82F] to-[#ff5555]' />

			<div className='p-5 text-[#FFFFFF]'>
				<div className='flex items-start justify-between'>
					<h3 className='text-lg font-bold text-[#F1A82F]'>{title}</h3>
					<StatusPill status={status} />
				</div>

				<div className='flex items-center gap-2 mt-4'>
					<Gift className='w-5 h-5 text-[#F1A82F]' />
					<span className='text-lg font-semibold'>{prize}</span>
				</div>

				<div className='mt-4 space-y-3'>
					<div className='flex justify-between text-sm text-[#D3D3D3]'>
						<div className='flex items-center gap-1.5'>
							<Users className='w-4 h-4' />
							<span>{participants} joined</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<Clock className='w-4 h-4' />
							<span>{endTime}</span>
						</div>
					</div>
				</div>

				<div className='mt-4'>
					{status === "active" && !isEntered && (
						<Button
							className='w-full bg-[#F1A82F] hover:bg-[#F1A82F] text-[#FFFFFF]'
							onClick={() => onEnter && onEnter(id)}
						>
							Enter Giveaway
						</Button>
					)}

					{status === "active" && isEntered && (
						<Button
							variant='outline'
							className='w-full text-[#F1A82F] border-[#F1A82F]'
							disabled
						>
							Entered
						</Button>
					)}

					{status === "completed" && (
						<Button
							variant='outline'
							className='w-full text-[#D3D3D3] border-[#D3D3D3]'
							disabled
						>
							Giveaway Ended
						</Button>
					)}

					{status === "upcoming" && (
						<Button
							variant='outline'
							className='w-full text-[#FFFFFF] border-[#FFFFFF]'
							disabled
						>
							Coming Soon
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

function StatusPill({ status }: { status: GiveawayStatus }) {
	if (status === "active") {
		return (
			<div className='px-2 py-0.5 rounded-full bg-[#F1A82F]/20 text-[#F1A82F] text-xs'>
				Active
			</div>
		);
	} else if (status === "completed") {
		return (
			<div className='px-2 py-0.5 rounded-full bg-[#D3D3D3]/20 text-[#D3D3D3] text-xs'>
				Completed
			</div>
		);
	} else {
		return (
			<div className='px-2 py-0.5 rounded-full bg-[#FFFFFF]/20 text-[#FFFFFF] text-xs'>
				Upcoming
			</div>
		);
	}
}
