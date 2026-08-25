import { useState } from 'react'
import { MapPin, Wallet, ExternalLink, Briefcase, Calendar, Check, Share2 } from 'lucide-react'
import { dateFormatter, currencyFormatter } from '@/utils/format'

function ShareButton({ title, company }: { title: string; company: string }) {

  const handleShare = async () => {
    const text = `${title} at ${company}`
    if (navigator.share) {
      await navigator.share({ title: text, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(`${text} — ${window.location.href}`)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 md:py-2 rounded-md border border-gray-200 text-gray-700 text-sm md:text-base hover:bg-gray-50 transition font-medium cursor-pointer"
      title="Share this job"
    >
      <Share2 className="w-4 h-4" />
    </button>
  )
}

export type JobListing = {
  application_id: string
  title: string
  company_name: string
  location?: string
  description: string
  min_charge?: string
  max_charge?: string
  job_type?: string
  category?: {
    category_id: string
    name: string
    description?: string
  }
  job_link?: string
  created_at: string
  is_remote?: boolean
}

export default function JobListingCard({
  title,
  company_name,
  location,
  description,
  min_charge,
  max_charge,
  job_type,
  category,
  job_link,
  created_at,
  is_remote,
}: JobListing) {
  const salaryMin = min_charge ? parseFloat(min_charge) : 0
  const salaryMax = max_charge ? parseFloat(max_charge) : 0
  const hasSalary = salaryMin > 0 || salaryMax > 0
  const hasWebsite = Boolean(job_link)

  return (
    <div className="bg-white shadow p-2.5 md:p-4 space-y-2 md:space-y-3 w-full">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-xs text-[1rem] font-medium text-gray-500 mb-0.5">
            {company_name}
          </p>
          <h3 className="font-semibold text-gray-900 text-sm text-[1rem] leading-tight">
            {title}
          </h3>
        </div>
        {job_type && (
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-blue-50 text-blue-700 text-xs whitespace-nowrap">
            <Briefcase className="w-3.5 h-3.5" />
            {job_type}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        {location && (
          <span className="inline-flex items-center gap-1 text-[0.7rem]">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {location}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          {dateFormatter(created_at)}
        </span>
        {category && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-gray-100 text-gray-600 capitalize">
            {category.name}
          </span>
        )}
        {is_remote && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-green-50 text-green-700 capitalize">
            Remote
          </span>
        )}
      </div>

      <p className="text-xs text-[0.9rem] text-gray-600 line-clamp-3">
        {description}
      </p>

      {hasSalary && (
        <div className="flex items-center gap-1 text-sm">
          <Wallet className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-gray-900">
            {currencyFormatter(salaryMin)} - {currencyFormatter(salaryMax)}
          </span>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {hasWebsite ? (
          <>
            <a
              href={job_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-1.5 md:py-2 rounded-md bg-primary text-white text-sm md:text-base hover:bg-primary/90 transition font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Apply Now</span>
            </a>
            <ViewDetailsButton
              title={title}
              company_name={company_name}
              location={location}
              description={description}
              min_charge={min_charge}
              max_charge={max_charge}
              job_type={job_type}
              category={category}
              job_link={job_link}
            />
            <ShareButton title={title} company={company_name} />
          </>
        ) : (
          <>
            <ApplyButton title={title} company_name={company_name} />
            <ViewMoreButton
              title={title}
              company_name={company_name}
              location={location}
              description={description}
              min_charge={min_charge}
              max_charge={max_charge}
              job_type={job_type}
              category={category}
            />
            <ShareButton title={title} company={company_name} />
          </>
        )}
      </div>
    </div>
  )
}

function ApplyButton({
  title,
  company_name,
}: {
  title: string
  company_name: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isApplied, setIsApplied] = useState(false)

  const handleApply = () => {
    setIsApplied(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsApplied(false)
    }, 2000)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-1.5 md:py-2 rounded-md bg-primary text-white text-sm md:text-base hover:bg-primary/90 transition font-medium cursor-pointer"
      >
        <ExternalLink className="w-4 h-4" />
        <span>Apply Now</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            {isApplied ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Application Submitted!
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Your application for {title} at {company_name} has been submitted.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Apply for {title}
                  </h3>
                  <p className="text-sm text-gray-500">{company_name}</p>
                </div>
                <p className="text-sm text-gray-600">
                  Are you sure you want to apply for this position? Your profile
                  will be shared with the employer.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition cursor-pointer"
                  >
                    Confirm Apply
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

type DetailProps = {
  title: string
  company_name: string
  location?: string
  description: string
  min_charge?: string
  max_charge?: string
  job_type?: string
  category?: { name: string }
}

function ViewMoreButton(props: DetailProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isApplied, setIsApplied] = useState(false)

  const salaryMin = props.min_charge ? parseFloat(props.min_charge) : 0
  const salaryMax = props.max_charge ? parseFloat(props.max_charge) : 0
  const hasSalary = salaryMin > 0 || salaryMax > 0

  const handleApply = () => {
    setIsApplied(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsApplied(false)
    }, 2000)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-1.5 md:py-2 rounded-md border border-gray-200 text-gray-700 text-sm md:text-base hover:bg-gray-50 transition font-medium cursor-pointer"
      >
        <span>View Details</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto space-y-4">
            {isApplied ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Application Submitted!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Your application for {props.title} at {props.company_name} has been submitted.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500">{props.company_name}</p>
                  <h3 className="text-lg font-semibold text-gray-900">{props.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {props.location && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-gray-100 text-gray-600">
                      <MapPin className="w-3.5 h-3.5" />
                      {props.location}
                    </span>
                  )}
                  {props.job_type && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-blue-50 text-blue-700">
                      <Briefcase className="w-3.5 h-3.5" />
                      {props.job_type}
                    </span>
                  )}
                  {props.category && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-green-50 text-green-700">
                      {props.category.name}
                    </span>
                  )}
                </div>

                {hasSalary && (
                  <div className="flex items-center gap-1 text-sm">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      {currencyFormatter(salaryMin)} -{' '}
                      {currencyFormatter(salaryMax)}
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                  <p className="text-sm text-gray-600">{props.description}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function ViewDetailsButton({
  title,
  company_name,
  location,
  description,
  min_charge,
  max_charge,
  job_type,
  category,
  job_link,
}: DetailProps & { job_link?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const salaryMin = min_charge ? parseFloat(min_charge) : 0
  const salaryMax = max_charge ? parseFloat(max_charge) : 0
  const hasSalary = salaryMin > 0 || salaryMax > 0

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-1.5 md:py-2 rounded-md border border-gray-200 text-gray-700 text-sm md:text-base hover:bg-gray-50 transition font-medium cursor-pointer"
      >
        <span>View Details</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">{company_name}</p>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {location && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-gray-100 text-gray-600">
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
                </span>
              )}
              {job_type && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-blue-50 text-blue-700">
                  <Briefcase className="w-3.5 h-3.5" />
                  {job_type}
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-green-50 text-green-700">
                  {category.name}
                </span>
              )}
            </div>

            {hasSalary && (
              <div className="flex items-center gap-1 text-sm">
                <Wallet className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-gray-900">
                  {currencyFormatter(salaryMin)} -{' '}
                  {currencyFormatter(salaryMax)}
                </span>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-1">Description</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                Close
              </button>
              {job_link && (
                <a
                  href={job_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply Now
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
